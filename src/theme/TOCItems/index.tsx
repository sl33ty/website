import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  useTOCHighlight,
  useFilteredAndTreeifiedTOC,
} from '@docusaurus/theme-common/internal';
import TOCItemTree from '@theme/TOCItems/Tree';

// Tracks which heading is currently active by watching scroll position.
function useActiveAnchorId(): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const navHeight = document.querySelector('.navbar')?.clientHeight ?? 0;
      const headings = Array.from(
        document.querySelectorAll('h2.anchor, h3.anchor'),
      ) as HTMLElement[];

      let active: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= navHeight + 16) {
          active = heading.id;
        }
      }
      setActiveId(active);
    };

    document.addEventListener('scroll', update, {passive: true});
    update();
    return () => document.removeEventListener('scroll', update);
  }, []);

  return activeId;
}

export default function TOCItems({
  toc,
  className = 'table-of-contents table-of-contents__left-border',
  linkClassName = 'table-of-contents__link',
  linkActiveClassName = undefined,
  minHeadingLevel: minHeadingLevelOption,
  maxHeadingLevel: maxHeadingLevelOption,
  ...props
}) {
  const themeConfig = useThemeConfig();
  const minHeadingLevel =
    minHeadingLevelOption ?? themeConfig.tableOfContents.minHeadingLevel;
  const maxHeadingLevel =
    maxHeadingLevelOption ?? themeConfig.tableOfContents.maxHeadingLevel;

  const tocTree = useFilteredAndTreeifiedTOC({toc, minHeadingLevel, maxHeadingLevel});

  const tocHighlightConfig = useMemo(() => {
    if (linkClassName && linkActiveClassName) {
      return {linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel};
    }
    return undefined;
  }, [linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel]);

  useTOCHighlight(tocHighlightConfig);

  const activeId = useActiveAnchorId();
  const [expandAll, setExpandAll] = useState(false);
  const toggleExpandAll = useCallback(() => setExpandAll(v => !v), []);

  // If there are no H2s with children, render as-is (flat structure edge case).
  const hasH2WithChildren = tocTree.some(item => item.children?.length > 0);

  const filteredTree = useMemo(() => {
    if (!hasH2WithChildren || expandAll) return tocTree;
    return tocTree.map(item => {
      const isActive =
        item.id === activeId ||
        item.children?.some(child => child.id === activeId);
      return {
        ...item,
        children: isActive ? item.children : [],
      };
    });
  }, [tocTree, activeId, hasH2WithChildren, expandAll]);

  return (
    <>
      <TOCItemTree
        toc={filteredTree}
        className={className}
        linkClassName={linkClassName}
        {...props}
      />
      {hasH2WithChildren && (
        <button
          onClick={toggleExpandAll}
          style={{
            marginTop: '0.75rem',
            padding: '0 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '11px',
            color: 'var(--docs-text-muted)',
            letterSpacing: '0.03em',
          }}
        >
          {expandAll ? '↑ Collapse all' : '↓ Expand all'}
        </button>
      )}
    </>
  );
}
