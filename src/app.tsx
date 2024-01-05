import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { FabricPreview } from './components/FabricPreview.tsx';
import { JSONEditor } from './components/JSONEditor.tsx';

export default function App() {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        if (data && data.trim().length) {
            localStorage.setItem('data', data);
        }
    }, [data]);

    useEffect(() => {
        const data = localStorage.getItem('data');
        if (data) {
            setData(data);
        }
    }, []);

    return (
        <PanelGroup
            direction='horizontal'
            id='group'
            className={'resize-group'}
        >
            <Panel id='left-panel'>
                <JSONEditor
                    data={data}
                    setData={setData}
                />
            </Panel>
            <PanelResizeHandle
                className={'resize-handle'}
                id='resize-handle'
            />
            <Panel id='right-panel'>
                <FabricPreview
                    data={data}
                    setData={setData}
                />
            </Panel>
        </PanelGroup>
    );
}
