import { notifications } from '@mantine/notifications';
import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';

import { Props } from '../types.ts';

export function FabricPreview({ data }: Props) {
    const domRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    const canvasRef = useRef<Canvas | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!domRef.current || !ref.current) {
            return;
        }

        const canvas = (canvasRef.current = new Canvas(ref.current, {
            preserveObjectStacking: true,
        }));
        console.log(canvas);
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (!canvasRef.current) {
                return;
            }

            canvasRef.current.setDimensions({
                width: domRef.current!.clientWidth,
                height: domRef.current!.clientHeight,
            });
        });

        resizeObserver.observe(domRef.current!);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        if (!data) {
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        notifications.show({
            message: '正在加载 JSON',
            color: 'blue',
            autoClose: 1000,
        });
        const parsed = JSON.parse(data);
        canvas
            .loadFromJSON(parsed, undefined, abortController)
            .then(() => {
                notifications.show({
                    message: 'JSON 加载成功',
                    color: 'green',
                    autoClose: 1000,
                });
                canvas.requestRenderAll();
            })
            .catch((err) => {
                canvas.requestRenderAll();
                console.log('Fabric Error', err);
                notifications.show({
                    message: 'JSON 加载失败',
                    color: 'red',
                    autoClose: 1000,
                });
            });
    }, [data]);

    return (
        <div
            ref={domRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: '#efefef',
            }}
        >
            <canvas ref={ref}></canvas>
        </div>
    );
}
