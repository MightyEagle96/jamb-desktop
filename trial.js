const { RandomizeQuestions } = require("./src/utils/data");

const data = [
  { startGroup: true, name: "Moses" },
  { name: "David" },
  { name: "Felix" },
  { stopGroup: true, name: "Joseph" },
  { name: "Kelechi" },
  { name: "Marcus" },
  { name: "Katherine" },
  { startGroup: true, name: "Jennifer" },
  { name: "Musa" },
  { name: "Tosin" },
  { stopGroup: true, name: "Nimrod" },
  { name: "Herod" },
  { name: "Nebuchadnezzar" },
  { startGroup: true, name: "Belshazzar" },
  { name: "Achish" },
  { name: "Asahel" },
  { stopGroup: true, name: "Michal" },
  { name: "Abner" },
];

const GetGroupedQuestions = (array) => {
  const groupedQuestions = [];

  let currentGroup = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].startGroup) {
      currentGroup = i;
      groupedQuestions.push({
        started: true,
        startPosition: currentGroup,
        stopped: false,
        stopPosition: 0,
      });
    }
    if (array[i].stopGroup) {
      const index = groupedQuestions.findIndex(
        (c) => c.startPosition === currentGroup
      );
      groupedQuestions[index].stopped = true;
      groupedQuestions[index].stopPosition = i;
    }
  }
  return groupedQuestions;
};

function PopulateGroupQuestions(array, startgroup, stopGroup) {
  const questionArray = [];
  for (let i = startgroup; i < stopGroup + 1; i++) {
    questionArray.push(array[i]);
  }
  return questionArray;
}

const organiseArray = (array) => {
  const groupedQuestions = GetGroupedQuestions(array);

  const populatedGroupQuestions = [];
  for (let i = 0; i < groupedQuestions.length; i++) {
    const question = PopulateGroupQuestions(
      array,
      groupedQuestions[i].startPosition,
      groupedQuestions[i].stopPosition
    );
    populatedGroupQuestions.push(question);
  }

  for (let i = 0; i < array.length; i++) {
    if (!array[i].startGroup && !array[i].stopGroup) {
      populatedGroupQuestions.push(array[i]);
    }
  }

  return populatedGroupQuestions;
};

console.log(RandomizeQuestions(organiseArray(data)));
//console.log(organiseArray(data));
