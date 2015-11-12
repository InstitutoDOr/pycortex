import cortex
from cortex import freesurfer

freesurfer.import_subj('SUBJ003', 'PRJ1210_SUBJ003')

from cortex import align


# functional reference image which will be coregistered with the freesurfer anatomical volume
reference = 'refS3.nii.gz' 
xfmname = 'fullhead'
align.automatic('PRJ1210_SUBJ003', xfmname, reference)
