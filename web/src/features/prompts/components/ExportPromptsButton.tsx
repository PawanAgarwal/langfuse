import { useState } from "react";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { ActionButton } from "@/src/components/ActionButton";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { promptsToCsv } from "@/src/features/prompts/utils/csvHelpers";
import type { ValidatedPrompt } from "@/src/features/prompts/server/utils/validation";

export const ExportPromptsButton = ({ projectId }: { projectId: string }) => {
  const hasAccess = useHasProjectAccess({ projectId, scope: "prompts:read" });
  const [open, setOpen] = useState(false);

  async function handleExport(format: "json" | "csv") {
    try {
      const res = await fetch(`/api/public/v2/prompts/export`);
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as ValidatedPrompt[];
      let content = "";
      let mime = "text/plain";
      let ext = "txt";
      if (format === "json") {
        content = JSON.stringify(data, null, 2);
        mime = "application/json";
        ext = "json";
      } else {
        content = promptsToCsv(data);
        mime = "text/csv";
        ext = "csv";
      }
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompts.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSuccessToast({
        title: "Export successful",
        description: `File prompts.${ext} downloaded`,
      });
    } catch (e) {
      showErrorToast(
        "Export failed",
        e instanceof Error ? e.message : String(e),
      );
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ActionButton
          variant="outline"
          hasAccess={hasAccess}
          icon={<Download className="h-4 w-4" aria-hidden="true" />}
        >
          Export
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("json")}>JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
