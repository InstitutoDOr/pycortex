from subprocess import Popen, PIPE
import re
import numpy as np

ss = [1, 2, 3, 4, 5, 7]

for s in ss:
    p = Popen(["fsl5.0-img2stdcoord", "-img", "../filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/reference.nii.gz", "-mm" , "cor_000"], stdout=PIPE)
    res = re.findall("[-+]?\d+[\.]?\d*[eE]?[-+]?\d*", p.communicate()[0])
    ref = []
    for c in res:
        ref.append(float(c))
    print ref
    
    p = Popen(["fsl5.0-img2stdcoord", "-img", "../filestore/db/PRJ1210_SUBJ00" +str(s)+"/anatomicals/raw.nii.gz", "-mm" , "cor_000"], stdout=PIPE)
    res = re.findall("[-+]?\d+[\.]?\d*[eE]?[-+]?\d*", p.communicate()[0])
    raw = []
    for c in res:
        raw.append(float(c))
    print raw
    
    x = raw[0] - ref[0]
    y = raw[1] + ref[2]
    z = raw[2] - ref[1]
    mat = np.matrix([[1, 0, 0, x], [0, 0, -1, y], [0, 1, 0, z],[0,0,0,1]])
    with open("../filestore/db/PRJ1210_SUBJ00" +str(s)+"/transforms/fullhead/ref2anat.mat",'w') as f:
        np.savetxt(f, mat, fmt='%.2f')
#    for line in mat:
#        np.savetxt(f, line, fmt='%.2f')
    
