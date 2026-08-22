import { ReactNode } from "react";

export default function ToolbarWrapper({ children }: { children: ReactNode }) {
    return (
    <div className={`flex w-full flex-row gap-3 mb-0 p-2 rounded-md shadow-md gradient-background sticky top-0 z-50 shrink-0`}>
        {
            children
        }
    </div>
    )
}