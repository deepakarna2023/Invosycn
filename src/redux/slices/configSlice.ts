import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
  selectedConfig: string | null;
}

const initialState: ConfigState = {
  selectedConfig: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setSelectedConfig: (state: { selectedConfig: any; }, action: PayloadAction<string | null>) => {
      state.selectedConfig = action.payload;
    },
  },
});

export const { setSelectedConfig } = configSlice.actions;
export default configSlice.reducer;
