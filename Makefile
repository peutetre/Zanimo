ZANIMO = zanimo
BUILDDIR = dist
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: build www

build: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

test:
	@@phantomjs test/launch.js

sauce:
	@@grunt test

www:
	@@stylus www/css/style.styl

clean:
	@@rm ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js
	@@rm ${BUILDDIR}/${ZANIMO}-${VERSION}.js

install: build www
	rsync -a --exclude='.git' . root@${host}:${path}

.PHONY: test www
