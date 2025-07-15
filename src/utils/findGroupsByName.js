import { groups } from "../../database/groups.js";

export const findGroupsByName = (names) => {
  const groupsIds = names.map(name => {
    const match = groups.find(item => item.FieldName === name);
    return match ? match.FieldId : null;
  }).filter(id => id !== null);

  return groupsIds;
};