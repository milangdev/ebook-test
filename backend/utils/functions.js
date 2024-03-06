function sortByCreatedAt(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  records.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return dateA - dateB;
  });

  return records;
}

module.exports = {
  sortByCreatedAt,
};
