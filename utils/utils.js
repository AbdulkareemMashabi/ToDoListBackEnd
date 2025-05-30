exports.handleFavoriteTask = async (taskId, user) => {
  let oldFavoriteTaskIndex;
  let newFavoriteTaskIndex;
  const userTasks = user.tasks;

  for (let i = 0; i < userTasks.length; i++) {
    if (userTasks[i]?.favorite) {
      oldFavoriteTaskIndex = i;
    }
    if (userTasks[i]?._id?.toString() === taskId?.toString()) {
      newFavoriteTaskIndex = i;
    }
    if (oldFavoriteTaskIndex && newFavoriteTaskIndex) {
      break;
    }
  }

  if (oldFavoriteTaskIndex?.toString()) {
    const oldItem = userTasks[oldFavoriteTaskIndex];
    oldItem.favorite = !oldItem.favorite;
    await oldItem.save();
  }
  if (
    newFavoriteTaskIndex?.toString() &&
    newFavoriteTaskIndex !== oldFavoriteTaskIndex
  ) {
    const newItem = userTasks[newFavoriteTaskIndex];
    newItem.favorite = !newItem.favorite;
    userTasks.splice(newFavoriteTaskIndex, 1);
    userTasks.unshift(newItem); // Add it to the beginning of the array
    await newItem.save();
  }

  return await user.save();
};
