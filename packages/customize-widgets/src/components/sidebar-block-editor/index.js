/**
 * WordPress dependencies
 */
import { useMemo, useRef } from '@wordpress/element';
import {
	BlockEditorProvider,
	BlockList,
	BlockSelectionClearer,
	ObserveTyping,
	WritingFlow,
} from '@wordpress/block-editor';
import { DropZoneProvider, SlotFillProvider } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Header from '../header';
import useSidebarBlockEditor from './use-sidebar-block-editor';
import initializeInserterOuterSection from '../inserter/inserter-outer-section';

function useInserter() {
	const inserterRef = useRef();

	if ( ! inserterRef.current ) {
		inserterRef.current = initializeInserterOuterSection();
	}

	return inserterRef.current;
}

export default function SidebarBlockEditor( { sidebar } ) {
	const [ blocks, onInput, onChange ] = useSidebarBlockEditor( sidebar );
	const inserter = useInserter();
	const settings = useMemo(
		() => ( {
			__experimentalSetIsInserterOpened: () => inserter.expand(),
		} ),
		[ inserter.expand ]
	);

	return (
		<SlotFillProvider>
			<DropZoneProvider>
				<BlockEditorProvider
					value={ blocks }
					onInput={ onInput }
					onChange={ onChange }
					settings={ settings }
				>
					<Header inserter={ inserter } />

					<BlockSelectionClearer>
						<WritingFlow>
							<ObserveTyping>
								<BlockList />
							</ObserveTyping>
						</WritingFlow>
					</BlockSelectionClearer>
				</BlockEditorProvider>
			</DropZoneProvider>
		</SlotFillProvider>
	);
}
