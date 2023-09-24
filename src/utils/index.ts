type ScenesArray = {
  _id?: string;
  videoId: string;
  title: string;
  newScene?: boolean;
  name: string;
  Question: string;
  ArrangementNo: number;
  localVideoId?: string;
  options: {
    Answer: string;
    SceneRef: string;
    _id?: string;
  }[];
  new?: boolean | undefined;
}[];

interface OptionsType {
  Answer: string;
  SceneRef: string;
  _id?: string | undefined;
}

//funtion to refine the options array

const checkOptions = (Options: OptionsType[]) => {
  const newOptionArr: OptionsType[] = [];
  for (let i = 0; i < Options.length; i++) {
    let Option = Options[i];
    if (Option?._id) {
      if (Option._id.includes("-")) {
        Option._id = undefined;
      }
    }
    newOptionArr.push(Option);
  }
  return newOptionArr;
};

export const trimScenes = (arrayEle: ScenesArray) => {
  const firstTrim = arrayEle.slice(0, 500); //reduce the array elements to a max of 500
  const TEMP_STORE = [];
  for (let i = 0; i < firstTrim.length; i++) {
    //loop through trimmed array and remove excess options, just incase someone finds a way to bypass the limit at the frontend
    let ele = firstTrim[i];
    if (ele?.newScene) {
      if (ele._id?.includes("-")) {
        ele._id = undefined;
      }
      ele.newScene = undefined;
    }

    const secondTrim = ele.options.slice(0, 2);
    ele.options = checkOptions(secondTrim);

    TEMP_STORE.push(ele);
  }
  return TEMP_STORE;
};

//function that doesnt allow errors get to the next function or output
export const Silent = async (anything: any) => {
  try {
    const res = anything;
    return res;
  } catch (e: any) {}
};
