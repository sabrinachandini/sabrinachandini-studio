import { getMediaItems } from '@/lib/cms';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default async function MediaPage() {
  const items = await getMediaItems();

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold mb-6">Media Library</h1>
      <MediaLibrary initialItems={items} />
    </div>
  );
}
