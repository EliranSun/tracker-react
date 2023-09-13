import { updateEnergy, getEnergy } from "../../utils/updateData";
import { Input } from "./Input";
import { useEffect, useState } from "react";
import { noop } from "lodash";

export const EnergyInput = ({ energy, date, onSuccess = noop }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newEnergy, setEnergy] = useState(energy);
  
  useEffect(() => {
    getEnergy(date).then((response) => {
      console.log({ response });
    });
  }, [energy]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'stretch' }}>
      <Input
        type="range"
        name="Energy"
        min={1}
        max={10}
        value={newEnergy}
        onChange={({ energy }) => {
          setEnergy(energy);
        }}/>
      {newEnergy && energy !== newEnergy &&
        <button onClick={async () => {
          const time = new Date().toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setIsLoading(true);
          await updateEnergy(newEnergy, date, time);
          setIsLoading(false);
        }}>
          {isLoading ? 'Updating...' : 'Update Energy'}
        </button>}
    </div>
  )
}