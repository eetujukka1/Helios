import { PowerIcon, PowerOffIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  HoverCardWrapper,
  HoverCardContentWrapper,
  HoverCardTriggerWrapper,
} from "@/components/reusables/hover-card"
import { useTranslation } from "react-i18next"

type EnableDisableButtonProps = {
  disabled: boolean
  onClick: () => void
}

export default function EnableDisableButton({
  disabled,
  onClick,
}: EnableDisableButtonProps) {
  const { t } = useTranslation()

  return (
    <HoverCardWrapper>
      <HoverCardTriggerWrapper>
        <Button variant="outline" size="xs" onClick={onClick}>
          {disabled ? <PowerIcon /> : <PowerOffIcon />}
        </Button>
      </HoverCardTriggerWrapper>
      <HoverCardContentWrapper>
        <div>
          {disabled ? t("common.actions.enable") : t("common.actions.disable")}
        </div>
      </HoverCardContentWrapper>
    </HoverCardWrapper>
  )
}
