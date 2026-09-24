/**
 * NETWORK CONTROLLER
 * Builds the recruitment/referral tree (genealogy tree) for display.
 * Uses a recursive CTE (MySQL/MariaDB 10.2+ support WITH RECURSIVE) to
 * fetch the entire downline in one query, then nests it into a tree
 * shape in JS. No hardcoded levels — works to any depth.
 */
const { sequelize, User } = require('../models');

// Fetch root user + ALL descendants as a flat list (root has level 0)
const fetchTree = async (rootId) => {
  const [rows] = await sequelize.query(`
    WITH RECURSIVE network_cte AS (
      SELECT id, login_id, name, role, phone, email, status, kyc_status,
             total_business_volume, referral_commission_percent, referred_by, createdAt,
             0 AS level
      FROM users
      WHERE id = :rootId

      UNION ALL

      SELECT u.id, u.login_id, u.name, u.role, u.phone, u.email, u.status, u.kyc_status,
             u.total_business_volume, u.referral_commission_percent, u.referred_by, u.createdAt,
             nc.level + 1
      FROM users u
      INNER JOIN network_cte nc ON u.referred_by = nc.id
    )
    SELECT * FROM network_cte ORDER BY level ASC;
  `, { replacements: { rootId } });

  return rows;
};

// Nest a flat list (from fetchTree) into a tree shape, starting at rootId
const buildTree = (flatList, rootId) => {
  const map = {};
  flatList.forEach((u) => { map[u.id] = { ...u, children: [] }; });

  flatList.forEach((u) => {
    if (u.id !== rootId && map[u.referred_by]) {
      map[u.referred_by].children.push(map[u.id]);
    }
  });

  return map[rootId] || null;
};

// @desc  Admin: full company network tree (from every top-level user — no upline)
// @route GET /api/network/full-tree
const getFullTree = async (req, res, next) => {
  try {
    const topUsers = await User.findAll({
      where: { referred_by: null, role: 'associate' },
      attributes: ['id']
    });

    const trees = [];
    for (const top of topUsers) {
      const flat = await fetchTree(top.id);
      const tree = buildTree(flat, top.id);
      if (tree) trees.push(tree);
    }

    const totalCount = await User.count({ where: { role: 'associate' } });

    res.json({ success: true, data: trees, totalCount });
  } catch (error) { next(error); }
};

module.exports = { getFullTree, fetchTree, buildTree };
