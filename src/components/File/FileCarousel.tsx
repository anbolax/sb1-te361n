import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import FilePreview from './FilePreview';

interface FileWithComment {
    file: File;
    comment: string;
    tempId: string;
}

interface FileCarouselProps {
    files: FileWithComment[];
    onFileDelete: (tempId: string) => void;
    onCommentChange: (tempId: string, comment: string) => void;
    onFileClick: (tempId: string) => void;
}

export default function FileCarousel({
    files,
    onFileDelete,
    onCommentChange,
    onFileClick
}: FileCarouselProps) {
    return (
        <Swiper
            spaceBetween={16}
            slidesPerView={2.2}
            className="w-full"
        >
            {files.map(({file, comment, tempId}) => (
                <SwiperSlide key={tempId} className="pt-2">
                    <FilePreview
                        file={file}
                        comment={comment}
                        onDelete={() => onFileDelete(tempId)}
                        onCommentChange={(newComment) => onCommentChange(tempId, newComment)}
                        onClick={() => onFileClick(tempId)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}