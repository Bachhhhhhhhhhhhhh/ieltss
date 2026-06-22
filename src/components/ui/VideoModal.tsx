import { ExternalLink } from 'lucide-react';
import { Modal } from './Modal';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  youtubeId: string;
}

export function VideoModal({ isOpen, onClose, title, youtubeId }: VideoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-teal hover:underline"
      >
        <ExternalLink size={16} />
        YouTube
      </a>
    </Modal>
  );
}