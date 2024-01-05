import { notifications } from '@mantine/notifications';
import { Editor } from '@monaco-editor/react';
import { get } from 'lodash-es';

import { Props } from '../types.ts';

export function JSONEditor({ data, setData }: Props) {
    return (
        <Editor
            height='100%'
            defaultLanguage='json'
            value={data}
            onMount={(editor) => {
                const handler = editor.onDidChangeModelDecorations((_) => {
                    handler.dispose();
                    editor.getAction('editor.action.formatDocument')?.run();
                });
            }}
            onChange={(value) => {
                if (!value) {
                    notifications.show({
                        title: 'JSON 不能为空',
                        message: '请输入 JSON',
                        color: 'red',
                        autoClose: 1000,
                    });
                    return;
                }

                // 尝试解析 JSON
                try {
                    JSON.parse(value);
                    setData(value);
                } catch (e) {
                    console.log('Editor Error', e);
                    // 解析失败，不更新
                    notifications.show({
                        title: 'JSON 解析失败',
                        message: get(e, 'message', '未知错误，请检查浏览器控制台'),
                        color: 'red',
                        autoClose: 1000,
                    });
                }
            }}
        />
    );
}
