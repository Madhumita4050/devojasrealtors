import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
import './NetworkTreeNode.css';

/**
 * NetworkTreeNode — renders a single associate node in the tree.
 * Renders in a horizontal org-chart layout with circular avatar,
 * name, login ID, and responsive connector lines.
 */
const NetworkTreeNode = ({ node, depth = 0, serial = { current: 1 } }) => {
  const [expanded, setExpanded] = useState(depth < 2);

  const hasChildren = node?.children && node.children.length > 0;
  const mySerial = serial.current++;

  // Distinct avatar gradients for tree levels
  const avatarColors = [
    'from-blue-500 to-indigo-600 text-white',
    'from-cyan-500 to-blue-600 text-white',
    'from-indigo-500 to-purple-600 text-white',
    'from-teal-500 to-cyan-600 text-white',
    'from-amber-500 to-orange-600 text-white',
  ];
  const avatarColor = avatarColors[depth % avatarColors.length];

  return (
    <div className="org-tree-wrapper">
      {/* Node Card */}
      <div 
        className="group relative bg-[#131f3e] border border-[#1e2f5a] hover:border-gold/60 rounded-2xl p-3 shadow-lg flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 w-48 z-10 select-none"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Avatar Circle */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-b ${avatarColor} flex items-center justify-center text-xl font-bold border-4 border-[#0a1628] shadow-md -mt-8`}>
           {node?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div className="text-center w-full">
          <p className="text-sm font-bold text-white truncate px-1" title={node?.name}>{node?.name || 'Associate'}</p>
          {node?.login_id && (
            <p className="text-[11px] text-gold font-bold flex items-center justify-center gap-1 mt-0.5">
              <Hash size={11} /> {node.login_id}
            </p>
          )}
          <p className="text-[10px] text-slate-400 mt-1">
            {node?.phone ? `📞 ${node.phone}` : (node?.createdAt ? `Join: ${new Date(node.createdAt).toLocaleDateString('en-IN')}` : '')}
          </p>
          <div className="mt-2 text-[10px] text-slate-400 bg-[#0a1628] rounded-md py-1 px-2 border border-[#1e2f5a] flex items-center justify-between">
            <span className="text-slate-500">#{mySerial}</span>
            <span className="text-gold font-semibold">{node?.referral_commission_percent ? `${node.referral_commission_percent}%` : 'Associate'}</span>
          </div>
        </div>

        {hasChildren && (
          <div className="absolute -bottom-3 bg-[#0d1d47] border border-[#1e2f5a] rounded-full p-1 shadow-md text-gold hover:text-gold-light transition-colors z-20">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </div>

      {/* Children Tree */}
      {hasChildren && expanded && (
        <div className="org-tree-children">
          {node.children.map((child) => (
            <div key={child.id} className="org-tree-node-col">
              <NetworkTreeNode node={child} depth={depth + 1} serial={serial} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkTreeNode;

