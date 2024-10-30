// npm install @mui/material @emotion/react @emotion/styled
import React from 'react';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const YesNoSwitch = styled(Switch)(({ theme }) => ({
  '& .Mui-checked': {
    color: '#4caf50', // Yes color (checked)
  },
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4caf50',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#f44336', // No color (unchecked)
  },
}));

export default function App() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <YesNoSwitch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'yes-no switch' }}
    />
  );
}
