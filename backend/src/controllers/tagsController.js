const tagsService = require("../services/tagsService");

const listTags = async (req, res, next) => {
  try {
    const data = await tagsService.listTags(req.user.id);
    res.json({ message: "Tags retrieved", data });
  } catch (err) {
    next(err);
  }
};

const createTag = async (req, res, next) => {
  try {
    const data = await tagsService.createTag(req.user.id, req.body.name);
    res.status(201).json({ message: "Tag created", data });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    await tagsService.deleteTag(req.params.id, req.user.id);
    res.json({ message: "Tag deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTags,
  createTag,
  deleteTag,
};
