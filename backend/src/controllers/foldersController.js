const foldersService = require("../services/foldersService");

const listFolders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = page || limit
      ? await foldersService.listFolders(req.user.id, req.query)
      : await foldersService.listFolders(req.user.id, null);
    res.json({ message: "Folders retrieved", data });
  } catch (err) {
    next(err);
  }
};

const createFolder = async (req, res, next) => {
  try {
    const data = await foldersService.createFolder(req.user.id, req.body.name);
    res.status(201).json({ message: "Folder created", data });
  } catch (err) {
    next(err);
  }
};

const updateFolder = async (req, res, next) => {
  try {
    const data = await foldersService.updateFolder(req.params.id, req.user.id, req.body.name);
    res.json({ message: "Folder updated", data });
  } catch (err) {
    next(err);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    await foldersService.deleteFolder(req.params.id, req.user.id);
    res.json({ message: "Folder deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
