import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
  label?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTabId,
  onChange,
  className = '',
  label = 'Content tabs',
}) => {
  const [activeId, setActiveId] = useState<string>(
    defaultTabId || items[0]?.id || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({ left: 0, width: 0, ready: false });

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const updateIndicator = useCallback(() => {
    const list = tabListRef.current;
    const activeTab = tabRefs.current.get(activeId);
    if (!list || !activeTab) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    setIndicatorStyle({
      left: tabRect.left - listRect.left + list.scrollLeft,
      width: tabRect.width,
      ready: true,
    });
  }, [activeId]);

  useEffect(() => {
    updateIndicator();

    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);

    if (document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateIndicator]);

  useEffect(() => {
    const activeTab = tabRefs.current.get(activeId);
    if (activeTab) {
      activeTab.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeId]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (onChange) onChange(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledItems = items.filter((item) => !item.disabled);
    const currentIndex = enabledItems.findIndex((item) => item.id === items[index]?.id);

    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledItems.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex !== -1 && enabledItems[nextIndex]) {
      e.preventDefault();
      const nextId = enabledItems[nextIndex].id;
      handleSelect(nextId);
      tabRefs.current.get(nextId)?.focus();
    }
  };

  return (
    <div className={`ark-tabs ${className}`.trim()}>
      <div className="tabs-header-wrapper">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label={label}
          className="tabs-list"
        >
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(item.id, el);
                  else tabRefs.current.delete(item.id);
                }}
                role="tab"
                id={`tab-${item.id}`}
                aria-controls={`panel-${item.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                className={`tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelect(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="tab-label">{item.label}</span>
              </button>
            );
          })}

          {indicatorStyle.ready && (
            <div
              className="tabs-indicator"
              style={{
                transform: `translateX(${indicatorStyle.left}px) scaleX(${indicatorStyle.width})`,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <div className="tabs-panels">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={`tab-${item.id}`}
              hidden={!isActive}
              className={`tab-panel ${isActive ? 'is-active' : ''}`}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
