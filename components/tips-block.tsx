"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

function TipsBlock({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="font-bold text-lg">{title}</p>

                <CollapsibleTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                        {open ? "Hide tips" : "Show tips"}
                    </Button>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
export default TipsBlock
