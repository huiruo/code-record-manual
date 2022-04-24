```javaScript
const handleClose = removedTag => {
	const _tags = tagsState.filter(item => item.id !== removedTag);
	state.tagsState = _tags;
	confirmCallback(_tags)
};
```
