import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import MarkdownToggle from './MarkdownToggle';
import EndBar from './EndBar';
import BackToTop from './BackToTop';
import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  // Always show the desktop column (even empty) to maintain consistent layout
  const showDesktopCol = windowSize === 'desktop' || windowSize === 'ssr';
  return {hidden, mobile, desktop, showDesktopCol};
}

export default function DocItemLayout({children}: {children: ReactNode}): ReactNode {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();
  const description = (frontMatter as {description?: string}).description;
  const articleProps = description
    ? {
        className: 'has-description',
        style: {'--doc-description': `"${description.replace(/"/g, '\\"')}"` } as React.CSSProperties,
      }
    : {};
  return (
    <MarkdownToggle>
      <div className="row">
        <div className={clsx('col', styles.docItemCol)}>
          <ContentVisibility metadata={metadata} />
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article {...articleProps}>
              <DocBreadcrumbs />
              <DocVersionBadge />
              {docTOC.mobile}
              <DocItemContent>{children}</DocItemContent>
              <DocItemFooter />
            </article>
            <DocItemPaginator />
          </div>
        </div>
        {docTOC.showDesktopCol && (
          <div className="col col--3">{docTOC.desktop}</div>
        )}
      </div>
      <EndBar />
      <BackToTop />
    </MarkdownToggle>
  );
}
