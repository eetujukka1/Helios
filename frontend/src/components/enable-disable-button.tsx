import { PowerIcon, PowerOffIcon } from "lucide-react";
import { Button } from "./ui/button";

type EnableDisableButtonProps = {
  disabled: boolean,
  onClick: () => void
}

export default function EnableDisableButton({disabled, onClick}: EnableDisableButtonProps) {
  return (
    <Button variant="outline" size="xs" onClick={onClick}>
      {disabled
      ? <PowerOffIcon/>
      : <PowerIcon/>
      }
    </Button>
  )
}