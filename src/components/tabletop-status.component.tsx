import { useEffect, useState } from 'react';
import { LoggingEvent, MoveEvent, StatusEvent, TabletopGrid } from '../services';
import { useTranslation } from 'react-i18next';

import styles from './tabletop-status.module.scss';

export interface TabletopStatusProperties {
  grid: TabletopGrid;
  infoTimeout?: number;
  warnTimeout?: number;
  errorTimeout?: number;
}

function timeoutForEventType(
  type: StatusEvent['type'],
  timeouts: Partial<Record<StatusEvent['type'], number | undefined>>
): number {
  if (type in timeouts && timeouts[type] && timeouts[type] > 0) {
    return timeouts[type];
  }
  switch (type) {
    case 'position':
      return 0;
    case 'info':
      return 1000;
    case 'warn':
      return 2000;
    case 'error':
      return 3000;
  }
}

export function TabletopStatus({ grid, infoTimeout, warnTimeout, errorTimeout }: TabletopStatusProperties) {
  const { t, i18n } = useTranslation();
  const [positionStatus, setPositionStatus] = useState<MoveEvent | undefined>();
  const [otherStatus, setOtherStatus] = useState<LoggingEvent | undefined>();
  const [displayStyle, setDisplayStyle] = useState('');
  const [displayStatus, setDisplayStatus] = useState('');
  // Update "status" state objects from observable
  useEffect(() => {
    const sub = grid.onStatus.subscribe((event) => {
      if (event.type === 'position') {
        setPositionStatus(event);
      } else {
        setOtherStatus(event);
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [grid]);
  // Clear "other status" state after a few seconds
  useEffect(() => {
    if (!otherStatus) {
      return;
    }
    const timeout = timeoutForEventType(otherStatus.type, {
      info: infoTimeout,
      warn: warnTimeout,
      error: errorTimeout,
    });
    const statusTimeoutId = setTimeout(() => {
      setOtherStatus(undefined);
    }, timeout);
    return () => {
      clearTimeout(statusTimeoutId);
    };
  }, [otherStatus, infoTimeout, warnTimeout, errorTimeout]);
  // Update "display status" state objects from other values
  useEffect(() => {
    if (otherStatus) {
      setDisplayStyle(styles['type-' + otherStatus.type]);
      setDisplayStatus(otherStatus.translationKey ? t(otherStatus.translationKey) : otherStatus.message);
    } else if (positionStatus) {
      setDisplayStyle(styles['type-position']);
      const message = t('status-movement-update', { x: positionStatus.to.x, y: positionStatus.to.y });
      setDisplayStatus(message);
    } else {
      setDisplayStyle(styles['type-info']);
      setDisplayStatus(t('status-not-ready'));
    }
  }, [t, i18n.language, positionStatus, otherStatus]);
  return (
    <>
      <div className={displayStyle}>
        <strong className={styles.label}>{t('status')}:</strong>
        <span>{displayStatus}</span>
      </div>
    </>
  );
}
