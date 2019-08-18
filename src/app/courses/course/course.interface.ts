export interface Course {
  id: string | number;
  style?: { [_: string]: string },
  travelStyle?: { [_: string]: string },
  spinStyle?: { [_: string]: string },
  destroy?: () => void;
  destroyInitiated?: boolean;
}