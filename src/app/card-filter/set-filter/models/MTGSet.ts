export interface MTGSet {
    code: string;   // For search etc.
    name: string;   // Full name for display
    type: string;   // Promo, commander, expansion etc. Will be used to filter on
    icon: string;   // Set icon for display small
  
    children: MTGSet[];
  }