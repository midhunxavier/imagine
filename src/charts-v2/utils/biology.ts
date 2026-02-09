/**
 * Newick format parser for phylogenetic trees
 * Newick format: (A:0.1,B:0.2,(C:0.3,D:0.4):0.5)E;
 */

export interface PhyloNode {
  id: string;
  name: string;
  branchLength?: number;
  bootstrap?: number;
  children?: PhyloNode[];
  parent?: PhyloNode;
  depth?: number;
  height?: number;
  x?: number;
  y?: number;
  isLeaf?: boolean;
}

export interface ParseOptions {
  /** Include bootstrap values from internal node labels */
  extractBootstrap?: boolean;
  /** Parse branch lengths */
  parseBranchLengths?: boolean;
}

/**
 * Parse a Newick format string into a tree structure
 */
export function parseNewick(newick: string, options: ParseOptions = {}): PhyloNode {
  const { extractBootstrap = true, parseBranchLengths = true } = options;
  
  // Remove whitespace and trailing semicolon
  const cleanNewick = newick.trim().replace(/;$/, '');
  
  let index = 0;
  let nodeId = 0;
  
  function parseNode(parent?: PhyloNode): PhyloNode {
    const node: PhyloNode = {
      id: `node-${nodeId++}`,
      name: '',
      parent,
      children: []
    };
    
    // Skip whitespace
    while (index < cleanNewick.length && /\s/.test(cleanNewick[index])) {
      index++;
    }
    
    // Check if this is an internal node (starts with '(')
    if (cleanNewick[index] === '(') {
      index++; // Skip '('
      
      // Parse children
      while (index < cleanNewick.length && cleanNewick[index] !== ')') {
        const child = parseNode(node);
        node.children!.push(child);
        
        // Skip whitespace
        while (index < cleanNewick.length && /\s/.test(cleanNewick[index])) {
          index++;
        }
        
        // Check for sibling separator
        if (cleanNewick[index] === ',') {
          index++; // Skip ','
        }
      }
      
      if (cleanNewick[index] === ')') {
        index++; // Skip ')'
      }
    }
    
    // Parse node name (and possibly bootstrap value)
    let name = '';
    while (index < cleanNewick.length && 
           cleanNewick[index] !== ':' && 
           cleanNewick[index] !== ',' && 
           cleanNewick[index] !== ')' &&
           cleanNewick[index] !== ';') {
      name += cleanNewick[index];
      index++;
    }
    
    name = name.trim();
    
    // Try to extract bootstrap value from name (format: "label_bootstrap" or just "bootstrap")
    if (extractBootstrap && name) {
      const bootstrapMatch = name.match(/^(\d+(?:\.\d+)?)$/);
      if (bootstrapMatch && !node.children?.length) {
        // It's just a number, might be bootstrap
        node.bootstrap = parseFloat(bootstrapMatch[1]);
      } else if (name.includes('_')) {
        const parts = name.split('_');
        const lastPart = parts[parts.length - 1];
        if (/^\d+(?:\.\d+)?$/.test(lastPart)) {
          node.bootstrap = parseFloat(lastPart);
          node.name = parts.slice(0, -1).join('_');
        } else {
          node.name = name;
        }
      } else {
        node.name = name;
      }
    } else {
      node.name = name;
    }
    
    // Parse branch length
    if (parseBranchLengths && cleanNewick[index] === ':') {
      index++; // Skip ':'
      let lengthStr = '';
      while (index < cleanNewick.length && 
             /[\d.eE+-]/.test(cleanNewick[index])) {
        lengthStr += cleanNewick[index];
        index++;
      }
      if (lengthStr) {
        node.branchLength = parseFloat(lengthStr);
      }
    }
    
    // Mark as leaf if no children
    node.isLeaf = !node.children || node.children.length === 0;
    
    return node;
  }
  
  const root = parseNode();
  
  // Calculate tree statistics
  calculateTreeStats(root);
  
  return root;
}

/**
 * Calculate tree depth, height, and other statistics
 */
function calculateTreeStats(node: PhyloNode, depth = 0): number {
  node.depth = depth;
  
  if (node.isLeaf) {
    node.height = 0;
    return 0;
  }
  
  let maxHeight = 0;
  for (const child of node.children || []) {
    const childHeight = calculateTreeStats(child, depth + 1);
    maxHeight = Math.max(maxHeight, childHeight + (child.branchLength || 0));
  }
  
  node.height = maxHeight;
  return maxHeight;
}

/**
 * Get all leaf nodes in the tree
 */
export function getLeafNodes(node: PhyloNode): PhyloNode[] {
  if (node.isLeaf) {
    return [node];
  }
  
  const leaves: PhyloNode[] = [];
  for (const child of node.children || []) {
    leaves.push(...getLeafNodes(child));
  }
  return leaves;
}

/**
 * Get all internal nodes in the tree
 */
export function getInternalNodes(node: PhyloNode): PhyloNode[] {
  if (node.isLeaf) {
    return [];
  }
  
  const internal: PhyloNode[] = [node];
  for (const child of node.children || []) {
    internal.push(...getInternalNodes(child));
  }
  return internal;
}

/**
 * Find a node by name
 */
export function findNodeByName(node: PhyloNode, name: string): PhyloNode | undefined {
  if (node.name === name) {
    return node;
  }
  
  for (const child of node.children || []) {
    const found = findNodeByName(child, name);
    if (found) return found;
  }
  
  return undefined;
}

/**
 * Get total tree height (max distance from root to leaf)
 */
export function getTreeHeight(node: PhyloNode): number {
  if (node.isLeaf) {
    return node.branchLength || 0;
  }
  
  let maxHeight = 0;
  for (const child of node.children || []) {
    const height = getTreeHeight(child) + (child.branchLength || 0);
    maxHeight = Math.max(maxHeight, height);
  }
  
  return maxHeight;
}

/**
 * Get number of leaves in the tree
 */
export function getLeafCount(node: PhyloNode): number {
  if (node.isLeaf) {
    return 1;
  }
  
  let count = 0;
  for (const child of node.children || []) {
    count += getLeafCount(child);
  }
  return count;
}

/**
 * Convert tree to Newick format
 */
export function toNewick(node: PhyloNode): string {
  if (node.isLeaf) {
    let newick = node.name || '';
    if (node.branchLength !== undefined) {
      newick += `:${node.branchLength}`;
    }
    return newick;
  }
  
  const childrenNewick = node.children!
    .map(child => toNewick(child))
    .join(',');
  
  let newick = `(${childrenNewick})${node.name || ''}`;
  if (node.branchLength !== undefined) {
    newick += `:${node.branchLength}`;
  }
  
  return newick;
}

/**
 * Sample phylogenetic trees for testing
 */
export const sampleTrees = {
  /** Simple tree with 4 species */
  simple: '((Human:0.1,Chimp:0.1):0.2,(Gorilla:0.15,Orangutan:0.2):0.15);',
  
  /** Mammalian tree with bootstrap values */
  mammals: '(((Human:0.03,Chimp:0.03)95:0.05,Gorilla:0.08)88:0.05,(Orangutan:0.12,Gibbon:0.15)92:0.05);',
  
  /** Larger tree with multiple clades */
  vertebrates: '((((Human:0.03,Chimp:0.03):0.05,Gorilla:0.08):0.05,(Orangutan:0.12,Gibbon:0.15):0.05):0.1,((Mouse:0.2,Rat:0.22):0.1,(Dog:0.25,Cat:0.28):0.08):0.05);',
  
  /** Unrooted-style tree */
  unrooted: '(A:0.1,B:0.15,(C:0.2,(D:0.1,E:0.1):0.1):0.05);'
};
