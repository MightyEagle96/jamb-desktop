// const data = [
//   { startGroup: true, name: "Moses" },
//   { name: "David" },
//   { name: "Felix" },
//   { stopGroup: true, name: "Joseph" },
//   { name: "Kelechi" },
//   { name: "Marcus" },
//   { name: "Katherine" },
//   { startGroup: true, name: "Jennifer" },
//   { name: "Musa" },
//   { name: "Tosin" },
//   { stopGroup: true, name: "Nimrod" },
//   { name: "Herod" },
//   { name: "Nebuchadnezzar" },
//   { startGroup: true, name: "Belshazzar" },
//   { name: "Achish" },
//   { name: "Asahel" },
//   { stopGroup: true, name: "Michal" },
//   { name: "Abner" },
// ];

// const RandomizeQuestions = (arrayToRandomize) => {
//   let randomizedArray = [];
//   let array = [];
//   for (let i = 0; i < arrayToRandomize.length; i++) {
//     let x = Math.floor(Math.random() * arrayToRandomize.length);
//     if (array.includes(x)) {
//       for (let j = 0; j < arrayToRandomize.length; j++) {
//         let y = Math.floor(Math.random() * arrayToRandomize.length);
//         if (array.includes(y) === false && array[i] !== y) {
//           array.push(y);
//           break;
//         }
//       }
//     } else array.push(x);
//   }
//   if (
//     array.length !== arrayToRandomize.length &&
//     array.length < arrayToRandomize.length
//   ) {
//     for (let i = 0; i < arrayToRandomize.length; i++) {
//       if (!array.includes(i)) array.push(i);
//     }
//   }

//   // return array;
//   for (let i = 0; i < arrayToRandomize.length; i++) {
//     randomizedArray.push(arrayToRandomize[array[i]]);
//   }

//   return randomizedArray;
// };

// const GetGroupedQuestions = (array) => {
//   const groupedQuestions = [];

//   let currentGroup = 0;
//   for (let i = 0; i < array.length; i++) {
//     if (array[i].startGroup) {
//       currentGroup = i;
//       groupedQuestions.push({
//         started: true,
//         startPosition: currentGroup,
//         stopped: false,
//         stopPosition: 0,
//       });
//     }
//     if (array[i].stopGroup) {
//       const index = groupedQuestions.findIndex(
//         (c) => c.startPosition === currentGroup
//       );
//       groupedQuestions[index].stopped = true;
//       groupedQuestions[index].stopPosition = i;
//     }
//   }
//   return groupedQuestions;
// };

// function PopulateGroupQuestions(array, startgroup, stopGroup) {
//   const questionArray = [];
//   for (let i = startgroup; i < stopGroup + 1; i++) {
//     array[i].grouped = true;

//     questionArray.push(array[i]);
//   }
//   return questionArray;
// }

// const OrganiseArray = (array) => {
//   const groupedQuestions = GetGroupedQuestions(array);

//   const populatedGroupQuestions = [];
//   for (let i = 0; i < groupedQuestions.length; i++) {
//     const question = PopulateGroupQuestions(
//       array,
//       groupedQuestions[i].startPosition,
//       groupedQuestions[i].stopPosition
//     );
//     populatedGroupQuestions.push(question);
//   }

//   array.forEach((element) => {
//     if (!element.grouped) {
//       populatedGroupQuestions.push(element);
//     }
//   });

//   return populatedGroupQuestions;
// };

// const FinalOutput = (array) => {
//   const finalArray = [];
//   const processedArray = RandomizeQuestions(OrganiseArray(array));

//   for (let i = 0; i < processedArray.length; i++) {
//     if (processedArray[i].length) {
//       processedArray[i].forEach((element) => {
//         finalArray.push(element);
//       });
//     } else {
//       finalArray.push(processedArray[i]);
//     }
//   }
//   return finalArray;
// };

// console.log(FinalOutput(data));

// const text =
//   " Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam numquam eaque fugit odio, pariatur repellendus possimus qui aspernatur. Laudantium tenetur dignissimos qui voluptates sit consequatur ut eveniet laboriosam, minima maxime!";

// function truncateString(str, num) {
//   if (str.length <= num) {
//     return str;
//   }
//   return str.slice(0, num) + "...";
// }

// console.log(truncateString(text, 80));
