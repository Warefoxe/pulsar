import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { DownloadItem } from '@/db/download';
import { modelManager, Models } from '@/entities/model';
import { DownloadsData, downloadsManager } from '@/entities/model/managers/downloads-manager.ts';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import { DownloadItemCard } from '../DownloadItemCard/DownloadItemCard.tsx';
import s from './DownloadsPage.module.scss';

function groupDownloads(data: DownloadsData, models: Models) {
  const res: Record<string, Record<string, DownloadItem[]>> = {};

  Object.values(data).forEach((d) => {
    const model = models[d.modelName];
    if (!model) return;

    const { author } = model.data;

    if (!res[author]) res[author] = {};

    if (!res[author][d.modelName]) res[author][d.modelName] = [];

    res[author][d.modelName].push(d);
  });

  return Object.entries(res);
}

export const DownloadsPage = memo(() => {
  const items = useUnit(downloadsManager.state.$downloadsData);
  const models = useUnit(modelManager.state.$models);

  const downloadsNumber = Object.keys(items).length;

  const downloads = useMemo(
    () =>
      groupDownloads(items, models).map(([author, data]) => (
        <DownloadItemCard key={author} author={author} data={data} />
      )),
    [items, models]
  );

  return (
    <div className={classNames(s.downloadsPage, [])}>
      <div className={s.header}>
        <Text c="primary" w="medium" s={14}>
          {downloadsNumber} installed files
        </Text>
      </div>

      <div className={s.fileListWrapper}>
        <Scrollbars className={s.filesList}>{downloads}</Scrollbars>
      </div>
    </div>
  );
});
