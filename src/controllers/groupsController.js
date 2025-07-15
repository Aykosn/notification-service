import { groups } from "../../database/groups.js"; 

export const getGroups = (req, res) => {
  res.status(200).json({ groups });
}