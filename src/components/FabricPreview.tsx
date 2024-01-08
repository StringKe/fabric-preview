import { notifications } from '@mantine/notifications';
import { Canvas } from 'fabric';
import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Props } from '../types.ts';

// @ts-ignore
window.fabric = fabric;

export function FabricPreview({ data, setData }: Props) {
    const domRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    const canvasRef = useRef<Canvas | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        if (!domRef.current || !ref.current) {
            return;
        }

        const canvas =
            // @ts-ignore
            (window['artboard'] =
            canvasRef.current =
                new Canvas(ref.current, {
                    preserveObjectStacking: true,
                }));
        // @ts-ignore
        window.updateData = () => {
            const jsonStr = JSON.stringify(canvas.toJSON(), null, 2);

            setData(jsonStr);
        };

        console.log(canvas);
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (!canvasRef.current) {
                return;
            }

            const size = {
                width: domRef.current!.clientWidth,
                height: domRef.current!.clientHeight,
            };

            canvasRef.current.setDimensions(size);
            setSize(size);
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
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    zIndex: 10000,
                    fontSize: '12px',
                    lineHeight: '12px',
                    padding: '4px 2px',
                }}
            >
                {size.width} x {size.height}
            </div>
        </div>
    );
}
