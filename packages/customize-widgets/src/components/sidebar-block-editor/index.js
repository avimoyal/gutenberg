/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import {
	BlockEditorProvider,
	BlockList,
	BlockSelectionClearer,
	ObserveTyping,
	WritingFlow,
	BlockEditorKeyboardShortcuts,
	__experimentalBlockSettingsMenuFirstItem,
} from '@wordpress/block-editor';
import {
	DropZoneProvider,
	SlotFillProvider,
	Popover,
} from '@wordpress/components';

/**
 * External dependencies
 */
import { useDialogState } from 'reakit/Dialog';

/**
 * Internal dependencies
 */
import Header from '../header';
import Inspector, { BlockInspectorButton } from '../inspector';
import useSidebarBlockEditor from './use-sidebar-block-editor';

export default function SidebarBlockEditor( { sidebar } ) {
	const [ blocks, onInput, onChange ] = useSidebarBlockEditor( sidebar );
	const inserter = useDialogState( {
		modal: false,
		animated: 150,
	} );
	const [ isInspectorOpened, setIsInspectorOpened ] = useState( false );
	const settings = useMemo(
		() => ( {
			__experimentalSetIsInserterOpened: inserter.setVisible,
		} ),
		[ inserter.setVisible ]
	);
	const collapse = () => setIsInspectorOpened( false );

	return (
		<>
			<BlockEditorKeyboardShortcuts.Register />
			<SlotFillProvider>
				<DropZoneProvider>
					<div hidden={ isInspectorOpened }>
						<BlockEditorProvider
							value={ blocks }
							onInput={ onInput }
							onChange={ onChange }
							settings={ settings }
							useSubRegistry={ false }
						>
							<BlockEditorKeyboardShortcuts />

							<Header inserter={ inserter } />

							<BlockSelectionClearer>
								<WritingFlow>
									<ObserveTyping>
										<BlockList />
									</ObserveTyping>
								</WritingFlow>
							</BlockSelectionClearer>
						</BlockEditorProvider>

						<Popover.Slot name="block-toolbar" />
						<Popover.Slot />
					</div>

					<Inspector
						isExpanded={ isInspectorOpened }
						collapse={ collapse }
					/>

					<__experimentalBlockSettingsMenuFirstItem>
						{ ( { onClose } ) => (
							<BlockInspectorButton
								onToggle={ () => {
									setIsInspectorOpened(
										( opened ) => ! opened
									);
									onClose();
								} }
							/>
						) }
					</__experimentalBlockSettingsMenuFirstItem>
				</DropZoneProvider>
			</SlotFillProvider>
		</>
	);
}
