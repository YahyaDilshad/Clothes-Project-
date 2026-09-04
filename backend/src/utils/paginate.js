/**
 * Extracts pagination params from a request query and returns
 * { page, limit, skip } plus a helper to build response meta.
 */
const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 200);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { getPagination, buildMeta };
