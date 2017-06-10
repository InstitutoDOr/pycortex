import cortex
from cortex import freesurfer

ss = [7]
for s in ss:
	freesurfer.import_subj('SUBJ00' +str(s), 'PRJ1210_SUBJ00' +str(s))

	from cortex import align


	# functional reference image which will be coregistered with the freesurfer anatomical volume
	reference = 'images/FUNC_REF/refS'  +str(s) + '.nii.gz' 
	xfmname = 'fullhead'
	align.automatic('PRJ1210_SUBJ00' +str(s), xfmname, reference)

