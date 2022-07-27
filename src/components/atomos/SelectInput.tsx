import * as React from 'react'
import { Picker } from '@react-native-picker/picker'
import { SelectPickerValues } from '../../models/Etiqueta.model'

interface SelectInputProps {
  values: SelectPickerValues[]
  setValuesSelected: (value: string) => void
}

const SelectInput = ({ values, setValuesSelected }: SelectInputProps) => {
  return (
    <Picker
      onValueChange={(itemValue) => setValuesSelected(itemValue as string)}
      mode="dropdown"
    >
      {values.map((item) => {
        const { nombre, value, enabled } = item
        return (
          <Picker.Item
            label={nombre}
            value={value}
            key={value}
            enabled={enabled}
            style={!enabled && { color: '#767676' }}
          />
        )
      })}
    </Picker>
  )
}

export default SelectInput
