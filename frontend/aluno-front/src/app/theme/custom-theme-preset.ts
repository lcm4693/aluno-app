import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    // #2196f3 NOVO
    // #3b82f6
    primary: palette('#3b82f6'), // base azul clara (como o antigo lara-light-blue)
  },
});
