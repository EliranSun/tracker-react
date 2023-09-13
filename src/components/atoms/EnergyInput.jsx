import { updateEnergy, getEnergy } from "../../utils/updateData";
import { Input } from "./Input";
import { useCallback, useEffect, useState } from "react";
import { noop } from "lodash";

export const EnergyInput = ({ date, onSuccess = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [initEnergy, setInitEnergy] = useState(0);
  const fetch = useCallback(async () => {
    const response = await getEnergy(date);
    
    if (!response.results.length)
      return;
    
    setEnergy(response.results.at(-1).level);
    setInitEnergy(response.results.at(-1).level);
  }, [date]);
  
  useEffect(() => {
    fetch();
  }, []);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'stretch' }}>
      <Input
        type="range"
        name="Energy"
        min={1}
        max={10}
        value={energy}
        onChange={value => setEnergy(Number(value))}/>
      {energy !== initEnergy &&
        <button onClick={async () => {
          const time = new Date().toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setIsLoading(true);
          await updateEnergy(energy, date, time);
          setIsLoading(false);
          fetch();
        }}>
          {isLoading ? 'Updating...' : 'Update Energy'}
        </button>}
    </div>
  )
}