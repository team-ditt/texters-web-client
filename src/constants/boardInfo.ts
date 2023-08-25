/* Temporary Constants, TODO: replace these with api calls */

type BoardIdType = string;
type BoardInfo = {
  name: string;
  description: string;
};
export const boards: {[key: BoardIdType]: BoardInfo} = {
  idea: {
    name: "텍스터즈 아이디어룸",
    description: `텍스터들의 아이디어가 실현되는 곳!\n여러분들의 아이디어를 자유롭게 나눠주세요!`,
  },
};
