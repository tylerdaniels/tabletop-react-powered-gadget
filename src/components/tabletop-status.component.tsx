import { useEffect, useRef, useState } from 'react';
import { StatusEvent, TabletopGrid } from '../services';
import { Subscription } from 'rxjs';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const subscription = useRef(Subscription.EMPTY);
  const [positionStatus, setPositionStatus] = useState<StatusEvent | undefined>();
  const [otherStatus, setOtherStatus] = useState<StatusEvent | undefined>();
  const [displayStatus, setDisplayStatus] = useState<StatusEvent | undefined>(otherStatus ?? positionStatus);
  // Update "status" state objects from observable
  useEffect(() => {
    const sub = grid.onStatus.subscribe((event) => {
      if (event.type === 'position') {
        setPositionStatus(event);
      } else {
        setOtherStatus(event);
      }
    });
    subscription.current = sub;
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
    setDisplayStatus(otherStatus ?? positionStatus);
  }, [positionStatus, otherStatus]);
  return (
    <>
      <div>
        <strong>{t('status')}</strong>
        <span>{displayStatus?.message}</span>
      </div>
    </>
  );
}
