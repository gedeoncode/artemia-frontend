import * as React from "react";
import { Callout } from "./Callout";
import { Info } from "lucide-react";

export function Blockquote(props: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <Callout variant="info" icon={Info} title="Note">
      {props.children}
    </Callout>
  );
}
