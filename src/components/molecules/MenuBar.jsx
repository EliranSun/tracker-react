import { Button } from "../atoms/Button";
import { MenuIcon } from "../atoms/MenuIcon";
import { MENU_ICON_SIZE } from "../../constants";
import { ArrowsClockwise, ChartBar, ClipboardText, Lightbulb } from "@phosphor-icons/react";

export const MenuBar = ({ onChartButtonClick, onFormButtonClick, onInsightsButtonClick }) => {
  return (
    <section className="fixed bottom-0 z-10 bg-gray-800 w-screen h-24 flex flex-row items-start">
      <Button onClick={onFormButtonClick}>
        <MenuIcon>
          <ClipboardText color="white" size={MENU_ICON_SIZE}/>
          Track
        </MenuIcon>
      </Button>
      <Button onClick={onChartButtonClick}>
        <MenuIcon>
          <ChartBar color="white" size={MENU_ICON_SIZE}/>
          Analytics
        </MenuIcon>
      </Button>
      <Button onClick={onInsightsButtonClick}>
        <MenuIcon>
          <Lightbulb color="white" size={MENU_ICON_SIZE}/>
          Insights
        </MenuIcon>
      </Button>
      <Button onClick={() => window.location.reload()}>
        <MenuIcon>
          <ArrowsClockwise color="white" size={MENU_ICON_SIZE}/>
          Refresh
        </MenuIcon>
      </Button>
    </section>
  );
}