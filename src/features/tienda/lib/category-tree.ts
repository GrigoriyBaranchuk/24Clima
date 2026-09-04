/**
 * Pure helpers for the two-level category tree.
 *
 * The public API (`GET /v1/catalog/categories`) returns a FLAT list with
 * `parent_id`; the tree is built on the client/server here. Products are only
 * assigned to leaves (UI convention), and `category_slug` of any level is
 * accepted by the backend, which rolls up descendants — so the frontend never
 * needs a second "subcategory" parameter.
 */

/** Minimal shape the helpers need — `Category` from api-client satisfies it. */
export type CategoryLike = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
};

export type CategoryNode<T extends CategoryLike = CategoryLike> = T & {
  children: Array<CategoryNode<T>>;
};

function compareCategories(a: CategoryLike, b: CategoryLike): number {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.name.localeCompare(b.name);
}

/**
 * Builds the roots (`parent_id === null`, or pointing at a category missing
 * from the list) with their `children`, both levels sorted by `sort_order`
 * then `name`.
 */
export function buildCategoryTree<T extends CategoryLike>(flat: T[]): Array<CategoryNode<T>> {
  const nodes = new Map<string, CategoryNode<T>>();
  for (const c of flat) {
    nodes.set(c.id, { ...c, children: [] });
  }
  const roots: Array<CategoryNode<T>> = [];
  for (const c of flat) {
    const node = nodes.get(c.id);
    if (!node) continue;
    const parent = c.parent_id != null ? nodes.get(c.parent_id) : undefined;
    // A dangling parent_id (parent not in the list) is treated as a root so the
    // category never silently disappears from the menu.
    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
  }
  for (const node of nodes.values()) {
    node.children.sort(compareCategories);
  }
  roots.sort(compareCategories);
  return roots;
}

export function findCategoryBySlug<T extends CategoryLike>(
  slug: string | null | undefined,
  flat: T[]
): T | null {
  if (!slug) return null;
  return flat.find((c) => c.slug === slug) ?? null;
}

/**
 * Ancestors of `slug`, ordered root-first and NOT including the category
 * itself. Returns `[]` for a root or an unknown slug.
 */
export function getAncestors<T extends CategoryLike>(
  slug: string | null | undefined,
  flat: T[]
): T[] {
  const current = findCategoryBySlug(slug, flat);
  if (!current) return [];
  const byId = new Map(flat.map((c) => [c.id, c]));
  const chain: T[] = [];
  const seen = new Set<string>([current.id]);
  let parentId = current.parent_id;
  while (parentId != null && !seen.has(parentId)) {
    const parent = byId.get(parentId);
    if (!parent) break;
    seen.add(parent.id);
    chain.push(parent);
    parentId = parent.parent_id;
  }
  return chain.reverse();
}

/**
 * True when `slug` is `rootSlug` itself or any of its descendants. Used instead
 * of an exact slug match so e.g. the BTU filter also shows on `mini-split`.
 */
export function isInSubtree<T extends CategoryLike>(
  slug: string | null | undefined,
  rootSlug: string,
  flat: T[]
): boolean {
  if (!slug) return false;
  if (slug === rootSlug) return true;
  return getAncestors(slug, flat).some((c) => c.slug === rootSlug);
}

/**
 * Minimal shape of a next-intl translator, so `categoryLabel` can be called
 * with the `tienda.category` namespace translator from a server component.
 */
export type CategoryTranslator = {
  (key: string): string;
  has: (key: string) => boolean;
};

/**
 * Localized category label: the `tienda.category.<slug>` message when it
 * exists, otherwise the Spanish `name` coming from the API. Server components
 * resolve the labels and pass them down as props (repo pattern).
 */
export function categoryLabel(t: CategoryTranslator, c: { slug: string; name: string }): string {
  return t.has(c.slug) ? t(c.slug) : c.name;
}

/** Direct children of the given category, sorted. */
export function getChildren<T extends CategoryLike>(
  slug: string | null | undefined,
  flat: T[]
): T[] {
  const current = findCategoryBySlug(slug, flat);
  if (!current) return [];
  return flat.filter((c) => c.parent_id === current.id).sort(compareCategories);
}
