import { fireEvent, render, waitFor } from "@testing-library/react";
import { ExportPromptsButton } from "./ExportPromptsButton";
import { ImportPromptsButton } from "./ImportPromptsButton";

jest.mock("@/src/features/rbac/utils/checkProjectAccess", () => ({
  useHasProjectAccess: () => true,
}));

jest.mock("@/src/features/notifications/showSuccessToast", () => ({
  showSuccessToast: jest.fn(),
}));

jest.mock("@/src/features/notifications/showErrorToast", () => ({
  showErrorToast: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve([]) }) as any,
) as jest.Mock;

describe("prompt export/import buttons", () => {
  it("calls export API", async () => {
    const { getByText } = render(<ExportPromptsButton projectId="p1" />);
    fireEvent.click(getByText("Export"));
    fireEvent.click(getByText("JSON"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/public/v2/prompts/export",
        expect.anything(),
      );
    });
  });

  it("shows file input on import", () => {
    const { getByText, container } = render(
      <ImportPromptsButton projectId="p1" />,
    );
    fireEvent.click(getByText("Import"));
    expect(container.querySelector('input[type="file"]')).toBeTruthy();
  });
});
