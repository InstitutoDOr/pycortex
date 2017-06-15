import cortex
from cortex import freesurfer


freesurfer.import_subj('fsaverage' , 'PRJ1210_average')

from cortex import align


# functional reference image which will be coregistered with the freesurfer anatomical volume
reference = 'images/MNI_S3/wrefS3.nii' 
xfmname = 'fullhead'
align.automatic('PRJ1210_average' , xfmname, reference)

