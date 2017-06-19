from subprocess import Popen, PIPE
import re
import cortex

ss = [1, 2, 3, 4, 5, 7]

for s in ss:
    f1 = "/home/brain/pycortex/filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/matrices.xfm"
    f2 = "/home/brain/pycortex/filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/matrices_first_import.xfm"
    #print f1
    #print f2
    #p = Popen(["cp",f1,f2], stdout=PIPE)
    #output = p.communicate()
    #print output


    fmat = "/home/brain/pycortex/filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/ref2anat.mat"
    cortex.align.precomputed("PRJ1210_SUBJ00" +str(s), "fullhead", "/home/brain/pycortex/filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/reference.nii.gz",fmat)
